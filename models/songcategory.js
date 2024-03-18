const SongCategorySchema = {
    id: {
      type: 'integer',
      primary: true,
      autoIncrement: true
    },
    category: {
      type: 'string',
      maxLength: 255
    }
  };
  