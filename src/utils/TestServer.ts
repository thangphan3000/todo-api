import app from '../app';

const startServer = () => {
  return app.listen(3000, () => {
    console.log(`Server is listening on the port: 3000`);
  });
};

export default startServer;
