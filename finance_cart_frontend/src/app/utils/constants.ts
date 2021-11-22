import { environment } from "src/environments/environment";

let WS_URL = environment.URI_BASE;

export default {
    URI: {
        BASE_PET: WS_URL + '/pets',
        LIST_PET_BY_PERSON_ID: WS_URL + '/pets/byPerson',
        BASE_CITA: WS_URL+'/appointments',
        ACCOUNT: WS_URL + '/users',
        ACCOUNT_LOGIN: WS_URL + '/users/login'
    }
}