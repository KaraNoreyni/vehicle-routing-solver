export const geocode = function (address) {
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
        geocoder.geocode({'address': address}, function (results, status) {
              if (status === 'OK') {
                 resolve(results[0].geometry.location)
              } else{
                  reject('Geocode was not successful for the following reason: ' + status)
              }
        })
    })
}