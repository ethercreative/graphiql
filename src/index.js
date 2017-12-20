import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from "graphiql";
import { parse, print } from "graphql";
import "graphiql/graphiql.css";
import registerServiceWorker from './registerServiceWorker';

function graphQLFetcher(endpoint, graphQLParams) {
	return fetch(endpoint, {
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(graphQLParams),
	}).then(response => response.json());
}

class CustomGraphiQL extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// REQUIRED:
			// `fetcher` must be provided in order for GraphiQL to operate
			fetcher: this.props.fetcher.bind(this, localStorage.getItem("endpoint")),
			
			// OPTIONAL PARAMETERS
			// GraphQL artifacts
			query: '',
			variables: '',
			response: '',
			
			// GraphQL Schema
			// If `undefined` is provided, an introspection query is executed
			// using the fetcher.
			schema: undefined,
			
			// Useful to determine which operation to run
			// when there are multiple of them.
			operationName: null,
			storage: null,
			defaultQuery: null,
			
			// Custom Event Handlers
			onEditQuery: null,
			onEditVariables: null,
			onEditOperationName: null,
			
			// GraphiQL automatically fills in leaf nodes when the query
			// does not provide them. Change this if your GraphQL Definitions
			// should behave differently than what's defined here:
			// (https://github.com/graphql/graphiql/blob/master/src/utility/fillLeafs.js#L75)
			getDefaultFieldNames: null,
			
			// History Panel
			historyPaneOpen: false,
		};
	}
	
	graphiql = null;
	
	// Example of using the GraphiQL Component API via a toolbar button.
	handleClickPrettifyButton = () => {
		const editor = this.graphiql.getQueryEditor();
		const currentText = editor.getValue();
		if (currentText.trim() === "") return;
		const prettyText = print(parse(currentText));
		editor.setValue(prettyText);
	};
	
	handleToggleHistory = () => {
		this.graphiql.handleToggleHistory();
	};
	
	render() {
		return (
			<GraphiQL ref={c => { this.graphiql = c; }} {...this.state}>
				<GraphiQL.Logo />
				<GraphiQL.Toolbar>
					
					<GraphiQL.ToolbarButton
						onClick={this.handleClickPrettifyButton}
						label="Prettify"
						title="Prettify Query (Shift-Ctrl-P)"
					/>
					
					<GraphiQL.ToolbarButton
						onClick={this.handleToggleHistory}
						title="Show History"
						label="History"
					/>
					
					<input
						type="text"
						placeholder="GraphQL Endpoint"
						style={{width:"20vw"}}
						defaultValue={localStorage.getItem("endpoint")}
						onChange={({ target: { value } }) => {
							localStorage.setItem("endpoint", value);
							this.setState({
								fetcher: this.props.fetcher.bind(this, value),
							});
						}}
					/>
				
				</GraphiQL.Toolbar>
			</GraphiQL>
		);
	}
}

ReactDOM.render((
	<div style={{height:"100%"}}>
		<CustomGraphiQL fetcher={graphQLFetcher} />
	</div>
), document.body);
registerServiceWorker();
