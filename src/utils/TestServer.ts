import app from '../app';

const startServer = () => {
  return app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on the port: 3000`);
  });
};

export default startServer;
