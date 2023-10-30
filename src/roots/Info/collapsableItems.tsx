import { CollapseProps } from 'antd'

export const collapsableItems: CollapseProps['items'] = [
  {
    key: '1',
    label: 'General Info ',
    children: <p>At the <strong>Dashboard</strong>, the top table, <strong>KPIs to update</strong> contains the KPIs you need to update with a new value. The bottom table, <strong>KPIs history record</strong> contains all already submitted values.</p>,
  },
  {
    key: '2',
    label: 'Add a new KPI value',
    children:
      <ol>
        <li>The top table on the dashboard <strong>KPIs to update</strong> contains the KPIs that are due now. Choose a KPI in this table that you want to add value to.</li>
        <li>Click the green <strong>Add value</strong> button in the row of the chosen KPI. A form appears with the KPI name in the heading, containing the summary of what you need to know about the KPI. Enter the new value in the cell <strong>New KPI value</strong>. </li>
        <li>Verify if the entered value is correct. </li>
        <li>Once verified, press <strong>Add value</strong> to submit the value.</li>
        <li>After the value is submitted, the new KPI value appears in the table at the bottom part of the dashboard: <strong>KPIs history record</strong>.</li>
      </ol>
  },
  {
    key: '3',
    label: 'Change a KPI value if it is already submitted',
    children: <p>The bottom table, <strong>KP Is history record</strong>,  contains already your submitted KPI values. You can edit them there.</p>,
  },
  {
    key: '4',
    label: 'Request a new KPI',
    children: <p>Access the <strong>Request a New KPI</strong> feature by clicking on the icon located in the side menu. Once there, you will be able to complete a form to submit your KPI request.</p>,
  },
  {
    key: '5',
    label: 'Download historical values',
    children: <p>To download KPIs, simply go to the second table and select the specific KPIs you want to download by checking the checkboxes from the table and then press the download button.</p>,
  },
  {
    key: '6',
    label: 'Download and view KPI charts',
    children: <p>From the dashboard, at the top of the <strong>KPIs history record</strong> table, you will see a button that allows you to view charts. Additionally, you have the option to download these charts directly from that page.</p>
  }
]