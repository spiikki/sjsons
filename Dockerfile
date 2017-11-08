FROM node:alpine
MAINTAINER spiikki@nalleperhe.net

RUN ["mkdir", "/src"]
RUN ["mkdir", "/data"]

ADD ["src","/src"]
ADD ["data","/data"]

WORKDIR /src

RUN ["npm","install"]

CMD ["node","server.js"]
