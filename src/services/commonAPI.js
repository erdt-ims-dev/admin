import API from 'services/Api'
import Routes from 'common/Routes'
export default {
	async authenticate(username, password, callback, errorCallback){
		await API.request('authenticate/auth', {username, password}, response => {
			callback(response)
		}, error => {
			errorCallback(error)
		})
	},
	async getAuthenticatedUser(callback, errorCallback){
		await API.request('authenticate/user', {}, response => {
			console.log(response)
			callback(response)
		}, error => {
			errorCallback(error)
		});
	}
}