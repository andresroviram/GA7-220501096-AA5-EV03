module.exports = function importMetaEnv() {
  return {
    visitor: {
      MemberExpression(path) {
        const { object, property, computed } = path.node;
        if (!computed && property.name === 'env' && object.type === 'MetaProperty' && object.meta.name === 'import' && object.property.name === 'meta') {
          path.replaceWithSourceString('process.env');
        }
      },
    },
  };
};
