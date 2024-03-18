const RoleSchema = {
    id: {
      type: 'integer',
      primary: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      maxLength: 255
    }
  };
  