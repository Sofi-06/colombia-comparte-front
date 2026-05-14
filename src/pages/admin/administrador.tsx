import Metrics from '../../components/metrics/metrics'
import Banner from '../../components/banner/banner'

export default function Administrador() {
	return (
		<div className="superadmin-content">
			<Banner />

			<section className="superadmin-card">
				<Metrics />
			</section>
		</div>
	)
}
