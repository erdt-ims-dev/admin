import API from 'services/api'
import Routes from 'common/Routes'
const api = {
	async authenticate(username, password, callback, errorCallback){
		await API.request(Routes.authenticate, {username, password}, response => {
			callback(response)
		}, error => {
			errorCallback(error)
		})
	},
	async getAuthenticatedUser(callback, errorCallback){
		await API.request(Routes.authenticatedUser, {}, response => {
			callback(response)
		}, error => {
			errorCallback(error)
		});
	}
}
export default api;