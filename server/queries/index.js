import knex from '../knex'
import Github from '../Github'
import Metrics from './metrics'

export default class Queries {

  constructor(currentUser, _knex=knex){
    this.currentUser = currentUser
    this.knex = _knex
    if (this.currentUser)
      this.github = new Github(this.currentUser.github_access_token)
  }

  getUserByGithubId(githubId){
    return this.knex
      .select('*')
      .from('users')
      .where('github_id', githubId)
      .first()
  }

  getUserByGithubUsername(githubUsername){
    return this.knex
      .select('*')
      .from('users')
      .where('github_username', githubUsername)
      .first()
  }

  getIncompletePrrrs(){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .orderBy('created_at', 'desc')
      .where({
        archived_at: null,
      })
  }

  getMyPrrs(){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .orderBy('created_at', 'desc')
      .where({
        requested_by: this.currentUser.github_username,
      })
      .orWhere({
        claimed_by: this.currentUser.github_username,
      })
  }

  uniquePrrrs( prrrs ){
    const prrrsObject = {}
    prrrs.forEach(prrr => {
      prrrsObject[prrr.id] = prrr
    })
    return prrrs = Object.keys(prrrsObject).map(k => prrrsObject[k])
  }

  getPrrrs(){
    return Promise.all([
      this.getIncompletePrrrs(),
      this.getMyPrrs()
    ])
      .then(([incompletePrrrs, myPrrrs]) => {
        let newPrrrs = incompletePrrrs.concat(myPrrrs)
        return this.uniquePrrrs( newPrrrs )
      })
  }

  getRequestedPrrrsByUsername(){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .orderBy('created_at', 'desc')
      .where({

        archived_at: null,
      })
  }

  getPrrrById(prrrId){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .where('id', prrrId)
      .first()
  }

  getPrrrForPullRequest(pullRequest){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .where({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        number: pullRequest.number,
      })
      .first()
  }

  getPullRequest({owner, repo, number}){
    return this.github.pullRequests.get({owner, repo, number})
  }

  getRequestorForPrrr(prrr){
    return knex
      .select('*')
      .from('users')
      .where('github_username', prrr.requested_by)
      .first()
  }

  metricsForWeek(week){
    return new Metrics({week, queries: this}).load()
  }
}
