module.exports = {
  apps: [
    {
      name: "findingsmanager",
      script: "./bin/www",
      instances: "max",
      autorestart: true,
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_docker: {
        NODE_ENV: "docker",
      },
    },
  ],
};
