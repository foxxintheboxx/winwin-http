exports.getUid = () => {
    var timestamp = (new Date()).getTime().toString(36),
            randomString = (Math.random() * 10000000000000000).toString(36).replace( '.', '' );

      return timestamp + '-' + randomString;
}
