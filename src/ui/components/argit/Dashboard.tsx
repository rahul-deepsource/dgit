import * as React from "react"
import { Link } from "react-router-dom"
import { connector } from "../../actionCreators/index"
import { lifecycle } from "recompose"
import { arweave } from "../../../index"
import {
  Repository,
  setIsAuthenticated,
  loadAddress,
  updateRepositories,
  loadNotifications,
  Notification
} from "../../reducers/argit"
import { Root } from "../atoms/Root"
import { GlobalHeader } from "../organisms/GlobalHeader"
import { LayoutManager } from "../organisms/LayoutManager"
import { Grid, GridArea } from "../utils/Grid"
import { Button } from "@blueprintjs/core"
import { openCreateRepoModal } from "../../reducers/app"
import { CreateRepoModal } from "../organisms/CreateRepoModal"
import { Repositories } from "./Repositories"
import { txQuery } from "../../../utils"

type ConnectedProps = {
  isAuthenticated: boolean
  repositories: Repository[]
  setIsAuthenticated: typeof setIsAuthenticated
  loadAddress: typeof loadAddress
  updateRepositories: typeof updateRepositories
  openCreateRepoModal: typeof openCreateRepoModal
  loadNotifications: typeof loadNotifications
  notifications: typeof Notification[]
}

export const Dashboard = connector(
  state => ({
    repositories: state.argit.repositories,
    address: state.argit.address,
    isAuthenticated: state.argit.isAuthenticated,
    notifications: state.argit.notifications
  }),
  actions => ({
    loadAddress: actions.argit.loadAddress,
    updateRepositories: actions.argit.updateRepositories,
    openCreateRepoModal: actions.app.openCreateRepoModal,
    loadNotifications: actions.argit.loadNotifications
  }),
  lifecycle<ConnectedProps, {}>({
    async componentDidMount() {
      // UI Boot
      // await delay(150)

      const { isAuthenticated, repositories, ...actions } = this.props

      if (isAuthenticated) {
        const address = await arweave.wallets.jwkToAddress(
          JSON.parse(String(sessionStorage.getItem("keyfile")))
        )
        actions.loadAddress({ address })

        const txids = await arweave.arql(txQuery(address, "create-repo"))
        let notifications: Notification[] = []
        const repositories = await Promise.all(
          txids.map(async txid => {
            let repository = {} as Repository
            const data: any = await arweave.transactions.getData(txid, {
              decode: true,
              string: true
            })
            try {
              const decoded: any = JSON.parse(data)
              repository = {
                name: decoded.name,
                description: decoded.description
              }
            } catch (error) {
              repository = {
                name: txid,
                description: "Pending confirmation"
              }
              notifications.push({
                type: "pending",
                action: "create-repo",
                txid: txid
              })
              console.log(notifications)
            }

            if (!repository) {
              repository = {
                name: txid,
                description: "null"
              }
            }

            return repository
          })
        )
        console.log(notifications)
        actions.loadNotifications({ notifications })
        actions.updateRepositories({ repositories })
      }
    }
  })
)(function RepositoriesImpl(props) {
  return (
    <Root data-testid="main">
      {/* prettier-ignore */}
      <Grid
    columns={[]}
    rows={[

    ]}
    areas={[

    ]}
    width="100vw"
    height="100vh"
  >
    { props.isAuthenticated &&
    <GridArea
      name="content"
    >
    <React.Fragment>
      <h1>
        Dashboard
        <Button
              className="bp3-outlined bp3-large bp3-minimal"
              icon="folder-new"
              onClick={() => props.openCreateRepoModal({})}
            >
              Create
          </Button>
      </h1>
    <h3>Total Repositories  = {props.repositories.length}</h3>
    <Repositories />

      {/* {props.repositories &&
        props.repositories.map(
          repository =>
            repository.name && (
              <div key={repository.name} className="card mt-4">
                <div className="card-body">
                  <Link to={`/${props.address}/${repository.name}`}>
                    {repository.name}
                  </Link>
                  <p>{repository.description}</p>
                </div>
              </div>
            )
        )} */}
    </React.Fragment>

    </GridArea>
}

  </Grid>
    </Root>
  )
})
