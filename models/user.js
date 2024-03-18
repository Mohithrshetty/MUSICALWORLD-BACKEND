const UserSchema = {
    id: {
      type: 'integer',
      primary: true,
      autoIncrement: true
    },
    role_id: {
      type: 'integer'
    },
    first_name: {
      type: 'string',
      maxLength: 255
    },
    last_name: {
      type: 'string',
      maxLength: 255
    },
    email_address: {
      type:"string",
      unique: true,
      maxLength: 255
    },
    phone_number: {
      type: 'string',
      unique: true,
      maxLength: 255
    },
    password: {
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
  