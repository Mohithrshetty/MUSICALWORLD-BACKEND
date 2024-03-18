// const FavoriteSongSchema = {
//     id: {
//       type: 'integer',
//       primary: true,
//       autoIncrement: true
//     },
//     user_id: {
//       type: 'integer'
//     },
//     song_id:{
//       type:'integer'
//     },
//     created_at: {
//       type: 'timestamp'
//     }
//   };

const FavoriteSongSchema = {
  id: {
    type: 'integer',
    primary: true,
    autoIncrement: true
  },
  user_id: {
    type: 'integer'
  },
  song_id: {
    type: 'integer'
  },
  song_title: {
    type: 'string',
    maxLength: 255
  },
  thumbnail: {
    type: 'string',
    maxLength: 255
  },
  music_file: {
    type: 'string',
    maxLength: 255
  },
  created_at: {
    type: 'timestamp'
  }
};


  