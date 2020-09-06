module.exports = (name, app, controller, links, security,
  updateGet, updateGetOne, updatePost, updateDelete, updatePut, updatePatch) => {
  const c = controller(name, undefined, {
    updateGet, updateGetOne, updatePost, updateDelete, updatePut, updatePatch,
  });

  const path = `/${name}`;
  const pathId = `${path}/:id`;
  const myPath = `/my/:login${path}`;
  const myPathId = `/my/:login${pathId}`;
  const ourPath = `/our/:group${path}`;
  const ourPathId = `/our/:group${pathId}`;

  if (security) {
    app.use(path, security);
    app.use(pathId, security);
    app.use(myPath, security);
    app.use(myPathId, security);
    app.use(ourPath, security);
    app.use(ourPathId, security);
  }

  app.get(path, c.get);
  app.post(path, c.post);
  app.delete(path, c.delete);

  app.get(pathId, c.get);
  app.patch(pathId, c.update);
  app.put(pathId, c.replace);
  app.delete(pathId, c.delete);

  if (security) {
    app.get(myPath, c.get);
    app.post(myPath, c.post);
    app.delete(myPath, c.delete);

    app.get(myPathId, c.get);
    app.patch(myPathId, c.update);
    app.put(myPathId, c.replace);
    app.delete(myPathId, c.delete);

    app.get(ourPath, c.get);
    app.post(ourPath, c.post);
    app.delete(ourPath, c.delete);

    app.get(ourPathId, c.get);
    app.patch(ourPathId, c.update);
    app.put(ourPathId, c.replace);
    app.delete(ourPathId, c.delete);
  }

  if (links) {
    for (const link of [].concat(links)) {
      const c1 = controller(name, link, {
        updateGet, updateGetOne, updatePost, updateDelete, updatePut, updatePatch,
      });
      const c2 = controller(link, name, {
        updateGet, updateGetOne, updatePost, updateDelete, updatePut, updatePatch,
      });
      const pathIdlinked1 = `/${name}/:id/${link}`;
      const pathIdlinked2 = `/${link}/:id/${name}`;
      if (security) {
        app.use(pathIdlinked1, security);
        app.use(pathIdlinked2, security);
      }

      app.get(pathIdlinked1, c1.get);
      app.get(pathIdlinked2, c2.get);
      app.post(pathIdlinked1, c1.post);
      app.post(pathIdlinked2, c2.post);
    }
  }
};
