import './banner.css'

type BannerProps = {
  eyebrow: string
  title: string
  message: string
  image: string
}

function Banner({ eyebrow, title, message, image }: BannerProps) {
  return (
    <article className="banner">
      <div className="banner__content">
        <p className="banner__eyebrow">{eyebrow}</p>
        <h1 className="banner__title">{title}</h1>
        <p className="banner__text">{message}</p>
      </div>

      <div className="banner__media" aria-hidden="true">
        <img className="banner__image" src={image} alt="" />
      </div>
    </article>
  )
}

export default Banner
