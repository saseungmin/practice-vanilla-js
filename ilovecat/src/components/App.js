import Nodes from './Nodes.js';
import Loading from './Loading.js';
import Breadcrumb from './Breadcrumb.js';
import ImageViewer from './ImageViewer.js';

import { fetchDirectory } from '../api/api.js';

const cache = {};

class App {
  constructor($app) {
    this.state = {
      isRoot: false,
      isLoading: false,
      nodes: [],
      depth: [],
      selectedFilePath: null,
    };

    console.log(cache);

    this.$app = $app;
    this.breadcrumb = new Breadcrumb({
      $app,
      initialState: this.state.depth,
      onClick: (index) => {
        if (index === null) {
          this.setState({
            ...this.state,
            depth: [],
            isRoot: true,
            nodes: cache.rootNodes,
          });

          return;
        }

        if (index === this.state.depth.length - 1) {
          return;
        }

        const nextState = {
          ...this.state,
        };

        const nextDepth = this.state.depth.slice(0, index + 1);

        console.log(cache, nextDepth[nextDepth.length - 1].id);

        this.setState({
          ...nextState,
          isRoot: false,
          depth: nextDepth,
          nodes: cache[nextDepth[nextDepth.length - 1].id],
        });
      },
    });
    this.nodes = new Nodes({
      $app: this.$app,
      initialState: {
        isRoot: this.state.isRoot,
        nodes: this.state.nodes,
      },
      onClick: async (node) => {
        const { id, type, filePath } = node;

        if (type === 'DIRECTORY') {
          if (cache[id]) {
            this.setState({
              ...this.state,
              isRoot: false,
              depth: [...this.state.depth, node],
              nodes: cache[id],
            });
          } else {
            this.setState({
              ...this.state,
              isLoading: true,
            });

            try {
              const nextNodes = await fetchDirectory(id);

              this.setState({
                ...this.state,
                depth: [...this.state.depth, node],
                nodes: nextNodes,
              });

              cache[id] = nextNodes;
            } catch (error) {
              console.error(error);
            } finally {
              this.setState({
                ...this.state,
                isLoading: false,
                isRoot: false,
              });
            }
          }
        } else if (type === 'FILE') {
          this.setState({
            ...this.state,
            selectedFilePath: filePath,
            isRoot: false,
          });
        }
      },
      onBackClick: async () => {
        const nextState = {
          ...this.state,
          depth: this.state.depth.slice(0, -1),
        };

        const { depth } = nextState;

        const prevNodeId = !depth.length ? null : depth[depth.length - 1].id;

        if (prevNodeId === null) {
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.rootNodes,
          });
        } else {
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: cache[prevNodeId],
          });
        }
      },
    });
    this.imageViewer = new ImageViewer({
      $app: this.$app,
      initialState: this.state.selectedFilePath,
    });
    this.loading = new Loading({
      $app: this.$app,
      initialState: this.state.isLoading,
    });

    this.init();
  }

  setState(nextState) {
    this.state = nextState;
    this.breadcrumb.setState(this.state.depth);
    this.nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    this.imageViewer.setState(this.state.selectedFilePath);
    this.loading.setState(this.state.isLoading);

    this.render();
  }

  render() {
    console.log(this.state);
  }

  async init() {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    try {
      const rootNodes = await fetchDirectory();

      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });

      cache.rootNodes = rootNodes;
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  }
}

export default App;
