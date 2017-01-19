import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Link from '../../atoms/Link'
import Date from '../../atoms/Date'
import Button from '../../atoms/Button'
import GithubUsername from '../../atoms/GithubUsername'
import PrrrsTable from '../PrrrsTable'
import ErrorMessage from '../../atoms/ErrorMessage'

export default class MyRequestedPrrrs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    prrrs: PropTypes.array.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {error: null}
  }
  renderAdditionalHeaders(){
    return [
      <th key="claimed">Claimed By</th>,
      <th key="completed">Completed</th>,
      <th key="actions">Actions</th>
    ]
  }
  renderAdditionalCells = (prrr) => {
    const { currentUser } = this.props
    if ( prrr.claimed_by &&  !prrr.completed_at ) {
      return [
        <td key="claimed">
          <span>by&nbsp;</span>
          <GithubUsername username={prrr.claimed_by} currentUser={currentUser} />
          <span>&nbsp;</span>
          <Date fromNow date={prrr.claimed_at} />
        </td>,
        <td key="completed">
          <span>not completed</span>
        </td>,
      ]
    }
    if ( prrr.claimed_by ) {
      return [
        <td key="claimed">
          <span>by&nbsp;</span>
          <GithubUsername username={prrr.claimed_by} currentUser={currentUser} />
          <span>&nbsp;</span>
          <Date fromNow date={prrr.claimed_at} />
        </td>,
        <td key="completed">
          <span>&nbsp;</span>
          <Date fromNow date={prrr.completed_at} />
        </td>,
      ]
    }
    return [
      <td key="claimed">
        <span>not claimed</span>
      </td>,
      <td key="completed">
        <span>not completed</span>
      </td>,
    ]
  }
  render(){
    const {currentUser} = this.props
    const prrrs = this.props.prrrs
      .filter(prrr => prrr.requested_by === currentUser.github_username)
      .filter(prrr => prrr.archived_at === null)
      .sort((a, b) =>
        moment(a.created_at).valueOf() -
        moment(b.created_at).valueOf()
      )
    return <div>
      <PrrrsTable
        className="MyRequestedPrrrs"
        currentUser={currentUser}
        prrrs={prrrs}
        renderAdditionalHeaders={this.renderAdditionalHeaders}
        renderAdditionalCells={this.renderAdditionalCells}
      />
    </div>
  }

}
