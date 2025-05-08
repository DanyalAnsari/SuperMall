import React, { useState } from "react";

const Carousel = ({ images }) => {
  const [productImage, setProductImage] = useState(images[0]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-6 items-center">
        {images.map((image, idx) => (
          <div
          key={idx}
            className="card card-sm bg-base-100 shadow-sm h-24 w-24 max-w-24 max-h-24"
            onClick={() => setProductImage(image)}
          >
            <figure className="card-body">
              <img src={image} className="object-cover rounded-md" />
            </figure>
          </div>
        ))}
      </div>
      <div className="card card-lg items-center max-w-[636px] max-h-[636px] shadow-sm">
        <figure className="card-body">
          <img
            src={productImage}
            className="rounded-md object-cover max-h-[500px] max-w-[500px]"
          />
        </figure>
      </div>
    </div>
  );
};

export default Carousel;
