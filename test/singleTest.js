import '../resources/main-test2';
import { controller } from './singleTest-controller';
import { service } from './singleTest-service';

class SinglePage extends JSpringComponent {
	constructor () {
		const selector = '#for_inst';
		super(controller, service, selector);
	}
}

const singlePage = new SinglePage();
console.log(singlePage);