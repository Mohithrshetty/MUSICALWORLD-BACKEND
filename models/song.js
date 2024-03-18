const SongSchema = {
    id: {
      type: 'integer',
      primary: true,
      autoIncrement: true
    },
    category_id: {
      type: 'integer'
    },
    user_id: {
      type: 'integer'
    },
    title: {
      type: 'string',
      maxLength: 255
    },
    thumbnail: {
      type: 'image',
      maxLength: 255
    },
    music_file:{
      type:'string',
      maxLength:255
    },
    description: {
      type: 'string',
      maxLength: 255
    },
    created_at: {
      type: 'timestamp'
    },
    updated_at: {
      type: 'timestamp'
    }
  };
  