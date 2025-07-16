

export const teachersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  number : {
    type: String,
    required: true,
    trim: true,
  },
  attendance : {
    type: Number,
    ref: 'Attendance',
  },
  certificate : {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true,
});


const Teachers = mongoose.model('Teachers', teachersSchema);

export default Teachers;