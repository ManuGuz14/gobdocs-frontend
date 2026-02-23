# Etapa de build
FROM node:20-alpine AS build

# 1. CORRECCIÓN: Usamos exactamente el mismo nombre que usas en tu código React
ARG VITE_REACT_APP_BACKEND
ENV VITE_REACT_APP_BACKEND=${VITE_REACT_APP_BACKEND}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# 2. CORRECCIÓN: Agregamos tu archivo nginx.conf para evitar los errores 404 de React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]