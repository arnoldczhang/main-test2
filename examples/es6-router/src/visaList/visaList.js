import { URL } from '../cm';
import controller from './controller-visaList';
import service from './service-visaList';

export class VisaList extends JSpringComponent {
  constructor (uniqId) {
    super(uniqId, controller, service);
  }
}
