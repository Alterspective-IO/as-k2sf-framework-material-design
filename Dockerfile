

FROM nginx
COPY dist /usr/share/nginx/html

# COPY --from=node /usr/lib /usr/lib
# COPY --from=node /usr/local/share /usr/local/share
# COPY --from=node /usr/local/lib /usr/local/lib
# COPY --from=node /usr/local/include /usr/local/include
# COPY --from=node /usr/local/bin /usr/local/bin

# RUN sleep 10


# RUN apk add --no-cache libstdc++ &&  apk add --no-cache libgcc
# # Install runtime dependencies
# RUN npm install 
# RUN npm install ngrok -g

# # Copy app source to work directory
# COPY dist /usr/src/app

# RUN sudo apt-get update

# # Install app dependencies
# RUN yarn install

#  RUN ngrok authtoken 23WmFhZ5wa2Vy8z9XwZ83AfKVxL_7r5sobhSqSRUeK8uZVhHA
# # Build and run the app
# CMD ["ngrok","http","--region=au","--hostname=mdux.alterspective.io","80"]


