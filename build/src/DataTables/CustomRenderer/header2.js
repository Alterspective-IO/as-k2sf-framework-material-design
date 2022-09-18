"use strict";
// import { Component } from "preact";
// import { isCheckboxColumn, isRowHeader, TuiGrid } from "sux-material-design-system/dist/types/components/as-materialdesign-datatable/tui-gridhelper";
// import { ColumnHeaderInfo, HeaderRenderer } from  "sux-material-design-system/dist/types/components/as-materialdesign-datatable/tui-gridhelper";
// import { isFunction } from "util";
// interface OwnProps {
//   columnInfo: ColumnHeaderInfo;
//   selected: boolean;
//   grid: TuiGrid;
//   colspan?: number;
//   rowspan?: number;
//   height?: number;
// }
// type Props = OwnProps;
// export class ColumnHeader extends Component<Props> {
//   private el?: HTMLElement;
//   private renderer?: HeaderRenderer;
//   private getElement(type: string) {
//     const { columnInfo } = this.props;
//     const { name, sortable, sortingType, filter, headerRenderer, header } = columnInfo;
//     if (headerRenderer) {
//       return null;
//     }
//     switch (type) {
//       case 'checkbox':
//         return isCheckboxColumn(name) ? <HeaderCheckbox /> : header;
//       case 'sortingBtn':
//         return sortable && <SortingButton columnName={name} sortingType={sortingType} />;
//       case 'sortingOrder':
//         return sortable && <SortingOrder columnName={name} />;
//       case 'filter':
//         return filter && <FilterButton columnName={name} />;
//       default:
//         return null;
//     }
//   }
//   public componentDidMount() {
//     const { columnInfo, grid } = this.props;
//     const { headerRenderer } = columnInfo;
//     if (!headerRenderer || !this.el) {
//       return;
//     }
//     const HeaderRendererClass = headerRenderer;
//     const renderer = new HeaderRendererClass({ grid, columnInfo });
//     const rendererEl = renderer.getElement();
//     this.el.appendChild(rendererEl);
//     this.renderer = renderer;
//     if (isFunction(renderer.mounted)) {
//       renderer.mounted(this.el);
//     }
//   }
//   public componentWillReceiveProps(nextProps: Props) {
//     if (this.renderer) {
//       this.renderer.render({ columnInfo: nextProps.columnInfo, grid: nextProps.grid });
//     }
//   }
//   public componentWillUnmount() {
//     if (this.renderer && isFunction(this.renderer.beforeDestroy)) {
//       this.renderer.beforeDestroy();
//     }
//   }
//   public render() {
//     const { columnInfo, colspan, rowspan, selected, height = null } = this.props;
//     const {
//       name,
//       headerAlign: textAlign,
//       headerVAlign: verticalAlign,
//       headerRenderer,
//     } = columnInfo;
//     return (
//       <th
//         ref={(el) => {
//           this.el = el;
//         }}
//         data-column-name={name}
//         style={{ textAlign, verticalAlign, padding: headerRenderer ? 0 : null, height }}
//         class={cls(
//           'cell',
//           'cell-header',
//           [!isRowHeader(name) && selected, 'cell-selected'],
//           [isRowHeader(name), 'cell-row-header'],
//           [isDraggableColumn(this.context.store, name) && !isRowHeader(name), 'header-draggable']
//         )}
//         {...(!!colspan && { colspan })}
//         {...(!!rowspan && { rowspan })}
//       >
//         {['checkbox', 'sortingBtn', 'sortingOrder', 'filter'].map((type) => this.getElement(type))}
//       </th>
//     );
//   }
// }
//# sourceMappingURL=header2.js.map