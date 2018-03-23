import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import Theme from './theme';
import './CodeEditor.css';
import Grammar from 'ballerina-grammar';
import BAL_LANG_CONFIG from 'ballerina-config';
import { Dimmer, Loader } from 'semantic-ui-react'

const BAL_LANGUAGE = 'ballerina-lang';
const BAL_WIDGET_MONACO_THEME = 'bal-widget-monaco-theme';
const MONACO_OPTIONS = {
    autoIndent: true,
    fontFamily: "Monaco",
    fontSize: 11,
    contextmenu: false,
    renderIndentGuides: false,
    autoClosingBrackets: true,
    matchBrackets: true,
    automaticLayout: true,
    lineNumbersMinChars: 4,
    scrollBeyondLastLine: false,
    minimap: {
        enabled: false
    },
    renderLineHighlight: 'none',
    scrollbar: {
        useShadows: true,
    },
    hideCursorInOverviewRuler: true,
}

/**
 * Source editor component which wraps monaco editor
 */
class CodeEditor extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
            editorMounted: false
        };
        this.monaco = undefined;
        this.editorInstance = undefined;
        this.editorDidMount = this.editorDidMount.bind(this);
        this.editorWillMount = this.editorWillMount.bind(this);
    }

    /**
     * Life-cycle hook for editor will mount
     * 
     * @param {Object} monaco Monaco API
     */
    editorWillMount(monaco) {
        this.monaco = monaco;
        monaco.languages.register({ id: BAL_LANGUAGE });
        monaco.editor.defineTheme(BAL_WIDGET_MONACO_THEME, Theme);
        monaco.languages.setMonarchTokensProvider(BAL_LANGUAGE, Grammar);
        monaco.languages.setLanguageConfiguration(BAL_LANGUAGE, BAL_LANG_CONFIG);
    }

    /**
     * Life-cycle hook for editor did mount
     *
     * @param {IEditor} editorInstance Current editor instance
     * @param {Object} monaco Monaco API
     */
    editorDidMount(editorInstance, monaco) {
        this.editorInstance = editorInstance;
        this.setState({
            editorMounted: true
        });
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div className='monaco-editor'>
                {!this.state.editorMounted &&
                    <Dimmer active inverted>
                        <Loader inverted />
                    </Dimmer>
                }
                <MonacoEditor
                    language={BAL_LANGUAGE}
                    value={this.props.content}
                    editorWillMount={this.editorWillMount}
                    editorDidMount={this.editorDidMount}
                    onChange={(newValue) => {
                        this.props.onChange(newValue);
                    }}
                    options={MONACO_OPTIONS}
                    theme={BAL_WIDGET_MONACO_THEME}
                />
            </div>
        );
    }
}

CodeEditor.propTypes = {
    content: PropTypes.string,
    onChange: PropTypes.func,
};

CodeEditor.defaultProps = {
    content: '',
    onChange: () => {},
};

export default CodeEditor;
