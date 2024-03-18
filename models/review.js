const ReviewSchema = {
  id: {
    type: 'integer',
    primary: true,
    autoIncrement: true
  },
  stars: {
    type: 'integer'
  },
  user_id: {
    type: 'integer'
  },
  song_id: {
    type: 'integer'
  }
};
