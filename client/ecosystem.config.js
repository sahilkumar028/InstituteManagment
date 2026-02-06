module.exports = {
    apps: [
      {
        name: "frontend",
        script: "serve",
        args: "-s build -l 3000",
        env: {
          REACT_APP_API_URL: "https://sahilapi.sahaedu.in",
          NODE_ENV: "production",
        },
      },
    ],
  };
  
