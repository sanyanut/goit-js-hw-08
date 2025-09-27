const images = [
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg",
    description: "Hokkaido Flower",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg",
    description: "Container Haulage Freight",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg",
    description: "Aerial Beach View",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg",
    description: "Flower Blooms",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg",
    description: "Alpine Mountains",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg",
    description: "Mountain Lake Sailing",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg",
    description: "Alpine Spring Meadows",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg",
    description: "Nature Landscape",
  },
  {
    preview:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg",
    original:
      "https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg",
    description: "Lighthouse Coast Sea",
  },
];

const refs = {
  gallery: document.querySelector(".gallery"),
  galleryItems: null,
};

function galleryLayout(images) {
  const markup = images
    .map(
      ({ preview, original, description }) => `
        <li class="gallery-item">
            <a class="gallery-link" 
                href="${original}">
            <img
                class="gallery-image"
                src="${preview}"
                data-source="${original}"
                alt="${description}"
            />
            </a>
        </li>
    `
    )
    .join("");

  refs.gallery.insertAdjacentHTML("beforeend", markup);
  refs.galleryItems = document.querySelectorAll(".gallery-item");
}

function sliderLayout() {
  const galleryLength = refs.galleryItems.length;

  refs.gallery.addEventListener("click", (e) => {
    if (!e.target.classList.contains("gallery-image")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const clickedImage = e.target;
    const imgSrc = clickedImage.getAttribute("data-source");
    const imgDescription = clickedImage.getAttribute("alt");

    const clickedItem = clickedImage.closest(".gallery-item");

    const currentIndex = Array.from(refs.galleryItems).indexOf(clickedItem);
    let currentImageIndex = currentIndex;
    let isAnimating = false;

    const instance = basicLightbox.create(
      `<div class="slide-wrapper">
            <div class="slide-content">
                <img class="slide-content-img" src="${imgSrc}" alt=""/>
                <div class="slide-content-description">
                    <div>${imgDescription}</div>
                </div>
            </div>
        </div>`,
      {
        closable: true,
        onShow: (instance) => {
          const slideContent = instance
            .element()
            .querySelector(".slide-content");
          const slideContentImg = instance
            .element()
            .querySelector(".slide-content-img");
          const slideDescription = instance
            .element()
            .querySelector(".slide-content-description div");

          const slideCountElement = instance
            .element()
            .querySelector(".slide-count");
          slideCountElement.textContent = `${
            currentImageIndex + 1
          } / ${galleryLength}`;

          const updateSlide = (direction) => {
            if (isAnimating) return;
            isAnimating = true;

            const outClass =
              direction === "next" ? "slide-out-left" : "slide-out-right";
            const inClass =
              direction === "next" ? "slide-in-right" : "slide-in-left";

            slideContent.classList.add(outClass);

            setTimeout(() => {
              if (direction === "next") {
                currentImageIndex = (currentImageIndex + 1) % galleryLength;
              } else {
                currentImageIndex =
                  (currentImageIndex - 1 + galleryLength) % galleryLength;
              }

              const nextItem = refs.galleryItems[currentImageIndex];
              const nextImage = nextItem.querySelector("img");
              const nextImageSrc = nextImage.getAttribute("data-source");
              const nextImageAlt = nextImage.getAttribute("alt");

              slideContent.classList.add("no-transition");

              slideContentImg.src = nextImageSrc;
              slideDescription.textContent = nextImageAlt;
              slideCountElement.textContent = `${
                currentImageIndex + 1
              } / ${galleryLength}`;

              slideContent.classList.remove(outClass);
              slideContent.classList.add(inClass);

              slideContent.offsetHeight;

              slideContent.classList.remove("no-transition");
              slideContent.classList.remove(inClass);

              isAnimating = false;
            }, 200);
          };

          instance
            .element()
            .querySelector(".slide-close")
            .addEventListener("click", () => {
              instance.close();
            });
          instance
            .element()
            .querySelector(".slide-next")
            .addEventListener("click", () => {
              updateSlide("next");
            });
          instance
            .element()
            .querySelector(".slide-prev")
            .addEventListener("click", () => {
              updateSlide("prev");
            });
        },
      }
    );

    instance.element().insertAdjacentHTML(
      "afterbegin",
      `<div class="slide-controls">
        <div class="slide-close"></div>
        <div class="slide-count">${
          currentImageIndex + 1
        } / ${galleryLength}</div>
        <div class="slide-next"></div>
        <div class="slide-prev"></div>
      </div>`
    );

    instance.show();
  });
}

galleryLayout(images);
sliderLayout();
