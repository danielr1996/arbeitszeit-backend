import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";

describe('arbeitszeit backend', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('authentication', ()=>{
    it('should return http 401 without an authorization header', () => {
      return request(app.getHttpServer())
          .get('/time/summary')
          .expect(401)
          .expect({statusCode: 401, message: 'No Token provided'})
    });
    it('should return http 401 with an invalid authorization header', () => {
      return request(app.getHttpServer())
          .get('/time/summary')
          .set('Authorization', 'Bearer bogusjwt')
          .expect(401)
          .expect({statusCode: 401,message: 'Token provided, but verification failed'})
    });
  })
});
