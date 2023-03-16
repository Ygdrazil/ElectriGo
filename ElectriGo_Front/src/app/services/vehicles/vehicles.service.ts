import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_VEHICLES = gql`
{
  vehicleList(
    size: 870
  ) {
    id
    naming {
      make
      model
    }
    range {
      chargetrip_range {
        worst
      }
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {


  constructor(private apollo: Apollo) { }

  getAllVehicles() {
    return this.apollo
    .watchQuery<any>({
        query: GET_VEHICLES,
      }).valueChanges.pipe(map(data => data.data.vehicleList));
  }
}
