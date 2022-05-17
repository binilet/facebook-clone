import React from "react";

const style = {
    imgPrev: {
        width: '500px',
        height: '500px',
        overflowY:'hidden'
    }
    ,
    imgClass: {
        width: '100%',
        height: '100%',
        objectFit:'cover'
    }

}

function ImagePreview({ url }) {
    return (<div style={style.imgPrev}>
        <img style={style.imgClass} src={url} /></div>);
}
export default ImagePreview;