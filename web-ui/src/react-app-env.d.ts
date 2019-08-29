/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_AWS_REGION: string;
    REACT_APP_AWS_BUCKET: string;
    REACT_APP_AWS_COGNITO_POOL_ID: string;
  }
}
