import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  githubId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String 
  },
  avatarUrl: { 
    type: String 
  },
  profileUrl: { 
    type: String 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Índices para optimización
UserSchema.index({ githubId: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ lastLogin: -1 });

export default mongoose.model('User', UserSchema);
