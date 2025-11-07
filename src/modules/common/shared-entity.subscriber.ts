import {
    EventActionStatus,
    EventActionType,
    EventLoggerService,
    JWTPayload,
    lookupAuthForExecutionAsyncIdRecursively,
  } from '@personal/common';
  import { Inject, Injectable } from '@nestjs/common';
  import { InjectConnection } from '@nestjs/typeorm';
  import { executionAsyncId } from 'async_hooks';
  import {
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
    Connection,
  } from 'typeorm';
  
  @Injectable()
  export class SharedEntitySubscriber implements EntitySubscriberInterface {
    constructor(
      @InjectConnection() private readonly connection: Connection,
      @Inject(EventLoggerService)
      private readonly eventLoggerService: EventLoggerService,
    ) {
      connection.subscribers.push(this);
    }
  
    lookupAuthForRequestIfAny(): JWTPayload {
      return lookupAuthForExecutionAsyncIdRecursively(executionAsyncId());
    }
  
    /**
     * Called after entity insertion.
     */
    afterInsert(event: InsertEvent<any>) {
      let entity = event.entity;
      let meta = {};
      if (!entity) return;
  
      if (entity['_meta']) {
        meta = entity['_meta'];
        delete entity['_meta'];
      }
  
      this.eventLoggerService.log({
        actionStatus: EventActionStatus.SUCCESS,
        actionType: EventActionType.CREATE,
        entityType: event.metadata.tableName,
        entityId: event.entity.id,
        date: new Date(),
  
        data: {
          post: entity,
          meta,
          entity,
        },
        auth: this.lookupAuthForRequestIfAny(),
      });
    }
  
    /**
     * Called after entity update.
     */
    afterUpdate(event: UpdateEvent<any>) {
      const pre = {};
      const post = {};
      let entity = event.entity;
      let meta = {};
  
      if (!entity) {
        return;
      }
  
      if (entity['_meta']) {
        meta = entity['_meta'];
        delete entity['_meta'];
      }
  
      // iterate columns
      for (const column of event.updatedColumns) {
        pre[column.propertyName] = event.databaseEntity[column.propertyName];
        post[column.propertyName] = entity[column.propertyName];
      }
  
      // const updatedKeys = Object.keys(event.databaseEntity);
      // Object.keys(event.entity).forEach((key) => {
      //   if (!updatedKeys.includes(key)) entity[key] = event.entity[key];
      // });
  
      // iterate relations
      for (const relation of event.updatedRelations) {
        // this might be an additional null vs. set-null instruction
        if (
          !(
            typeof event.databaseEntity[relation.propertyName] === 'object' &&
            Object.keys(event.databaseEntity[relation.propertyName]).length ===
              1 &&
            Object.values(event.databaseEntity[relation.propertyName])[0] ===
              null &&
            event.entity[relation.propertyName] === null
          )
        ) {
          pre[relation.propertyName] =
            event.databaseEntity[relation.propertyName];
  
          // for the post entity, only take the foreign key - otherwise we might be spamming the event log
          if (event.entity[relation.propertyName]) {
            const postEntity = {};
            for (const k in event.databaseEntity[relation.propertyName]) {
              postEntity[k] = event.entity[relation.propertyName][k];
            }
            post[relation.propertyName] = postEntity;
          } else {
            post[relation.propertyName] = null;
          }
        }
      }
  
      if (Object.keys(pre).length > 0 || Object.keys(post).length > 0) {
        this.eventLoggerService.log({
          actionStatus: EventActionStatus.SUCCESS,
          actionType: EventActionType.UPDATE,
          entityType: event.metadata.tableName,
          entityId: event.entity.id,
          date: new Date(),
          data: {
            pre,
            post,
            entity,
            meta,
          },
          auth: this.lookupAuthForRequestIfAny(),
        });
      }
    }
  
    /**
     * Called after entity removal.
     */
    afterRemove(event: RemoveEvent<any>) {
      this.eventLoggerService.log({
        actionStatus: EventActionStatus.SUCCESS,
        actionType: EventActionType.DELETE,
        entityType: event.metadata.tableName,
        entityId: event.entityId,
        date: new Date(),
        data: {},
        auth: this.lookupAuthForRequestIfAny(),
      });
    }
  }
  