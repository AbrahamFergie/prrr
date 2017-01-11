import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Link from '../../atoms/Link'
import Button from '../../atoms/Button'
import PrrrsTable from '../PrrrsTable'
import ErrorMessage from '../../atoms/ErrorMessage'
import claimPrrr from '../../../actions/claimPrrr'

export default class PendingPrrrs extends Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    prrrs: PropTypes.array.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {error: null}
  }

  claimPrrr(prrr){
    claimPrrr(prrr.id)
  }

  renderAdditionalHeaders(){
    return [
      <th key="actions">Actions</th>,
    ]
  }

  renderAdditionalCells = (prrr) => {
    const { currentUser } = this.props
    const disabled = prrr.requested_by === currentUser.github_username
    return [
      <td key="actions">
        <Button onClick={_ => this.claimPrrr(prrr)} disabled={disabled}>
          Claim
        </Button>
      </td>,
    ]
  }

  render(){
    const prrrs = this.props.prrrs
      .filter(prrr => !prrr.claimed_by)
      .sort((a, b) =>
        moment(a.created_at).valueOf() -
        moment(b.created_at).valueOf()
      )

    return <div>
      {this.state.error ? <ErrorMessage error={this.state.error} /> : null}
      <PrrrsTable
        className="PendingPrrrs"
        currentUser={this.props.currentUser}
        prrrs={prrrs}
        renderAdditionalHeaders={this.renderAdditionalHeaders}
        renderAdditionalCells={this.renderAdditionalCells}
      />
    </div>
  }
}
