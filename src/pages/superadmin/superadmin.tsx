import { HiOutlineArrowLeft } from 'react-icons/hi'
import './superadmin.css'

function Superadmin() {
	return (
		<main className="superadmin-page">
			<div className="superadmin-page__glow superadmin-page__glow--left" aria-hidden="true" />
			<div className="superadmin-page__glow superadmin-page__glow--right" aria-hidden="true" />

			<a className="superadmin-page__back" href="#/">
				<HiOutlineArrowLeft aria-hidden="true" />
				<span>Volver al inicio</span>
			</a>

			<section className="superadmin-shell" aria-label="Panel superadmin">
				<article className="superadmin-card">
					<p className="superadmin-card__eyebrow">Panel Superadmin</p>
					<h1 className="superadmin-card__title">Hi, Superadmin</h1>
					<p className="superadmin-card__text">Ready to start your day with some insights?</p>
					<p className="superadmin-card__note">
						Por ahora este espacio queda listo para mostrar métricas, accesos y controles del sistema.
					</p>
				</article>

				<aside className="superadmin-visual" aria-hidden="true">
					<div className="superadmin-visual__frame">
						<div className="superadmin-visual__desk" />
						<div className="superadmin-visual__character">
							<span className="superadmin-visual__hair" />
							<span className="superadmin-visual__body" />
							<span className="superadmin-visual__arm" />
							<span className="superadmin-visual__arm superadmin-visual__arm--right" />
						</div>
						<div className="superadmin-visual__laptop" />
						<div className="superadmin-visual__cup" />
					</div>
				</aside>
			</section>
		</main>
	)
}

export default Superadmin
