// Middleware para autenticación con GitHub OAuth 
export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    req.userId = req.user._id;
    return next();
  }
  
  return res.status(401).json({ 
    error: 'Unauthorized', 
    message: 'Authentication required. Please login with GitHub.',
    redirectTo: '/auth/github'
  });
}

// Middleware híbrido: soporta tanto OAuth como clientId temporal
export function requireAuthOrClient(req, res, next) {
  // Prioridad 1: Usuario autenticado con GitHub
  if (req.isAuthenticated()) {
    req.userId = req.user._id;
    req.authType = 'oauth';
    return next();
  }
  
  // Prioridad 2: Cliente temporal (para compatibilidad)
  const clientId = req.header('X-Client-Id');
  if (clientId) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(clientId)) {
      req.clientId = clientId;
      req.authType = 'client';
      return next();
    }
  }
  
  return res.status(401).json({ 
    error: 'Unauthorized', 
    message: 'Authentication required',
    options: {
      github: '/auth/github',
      client: 'Include X-Client-Id header'
    }
  });
}

// Middleware original para compatibilidad
export function requireClient(req, res, next) {
  const clientId = req.header('X-Client-Id');
  
  if (!clientId) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Missing authentication header' 
    });
  }
  
  // Validar formato básico del clientId 
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(clientId)) {
    return res.status(401).json({ 
      error: 'Invalid client ID format',
      message: 'Client ID must be a valid UUID v4' 
    });
  }
  
  req.clientId = clientId;
  next();
}

// Middleware para validar ObjectId de MongoDB
export function validateObjectId(req, res, next) {
  const { id } = req.params;
  
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ 
      error: 'Invalid ID format',
      message: 'ID must be a valid MongoDB ObjectId' 
    });
  }
  
  next();
}

// Middleware para manejo global de errores
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Validation Error', 
      message: errors.join(', ') 
    });
  }
  
  // Error de clave duplicada (MongoDB)
  if (err.code === 11000) {
    return res.status(409).json({ 
      error: 'Duplicate Entry', 
      message: 'Ya existe un registro con estos datos' 
    });
  }
  
  // Error de casting de ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid ID', 
      message: 'Invalid MongoDB ObjectId format' 
    });
  }
  
  // Error genérico del servidor
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'Something went wrong on our end' 
  });
}
