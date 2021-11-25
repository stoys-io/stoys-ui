import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import cytoscape from 'cytoscape'

// @ts-ignore
import cytoscapeDomNode from 'cytoscape-dom-node'

// @ts-ignore
import expandCollapse from 'cytoscape-expand-collapse'

// @ts-ignore
import cytoscapeFcose from 'cytoscape-fcose'

// @ts-ignore
import undoRedo from 'cytoscape-undo-redo'

// @ts-ignore
import dagre from 'cytoscape-dagre'

const Cyt = () => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    cytoscape.warnings(true)

    cytoscape.use(cytoscapeDomNode)
    cytoscape.use(cytoscapeFcose)
    cytoscape.use(expandCollapse)
    cytoscape.use(dagre)
    cytoscape.use(undoRedo)

    const actualElements = elements.map((el: any) => {
      if (el.group !== 'nodes') {
        return el
      }

      const div = document.createElement('div')
      div.id = `node-${el.data.id}`

      return { ...el, data: { ...el.data, dom: div } }
    })

    console.log({ actualElements })

    const cy = cytoscape({
      container: ref.current,
      elements: actualElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#ad1a66',
          },
        },
        {
          selector: ':parent',
          style: {
            'background-opacity': 0.333,
          },
        },
        {
          selector: 'node.cy-expand-collapse-collapsed-node',
          style: {
            'background-color': 'darkblue',
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ad1a66',
            'curve-style': 'straight',
          },
        },
        {
          selector: 'edge.meta',
          style: {
            width: 2,
            'line-color': 'red',
          },
        },
        {
          selector: ':selected',
          style: {
            'overlay-color': '#6c757d',
            'overlay-opacity': 0.3,
            'background-color': '#999999',
          },
        },
      ],

      layout: {
        name: 'dagre',
      },
    })

    // @ts-ignore
    cy.domNode()
    const El = React.createElement('button', { onClick: console.log }, 'click')
    elements.forEach((el: any) => {
      if (el.group === 'nodes') {
        ReactDOM.render(El, document.getElementById(`node-${el.data.id}`))
      }
    })

    // @ts-ignore
    const ur = cy.undoRedo()

    // @ts-ignore
    cy.expandCollapse({
      layoutBy: {
        name: 'dagre',
        animate: true,
        randomize: false,
        fit: true,
      },
      fisheye: true,
      animate: true,
    })

    document.getElementById('collapseRecursively')?.addEventListener('click', function () {
      ur.do('collapseRecursively', {
        nodes: cy.$(':selected'),
      })
      cy.layout({ name: 'dagre' }).run()
    })

    document.getElementById('expandRecursively')?.addEventListener('click', function () {
      ur.do('expandRecursively', {
        nodes: cy.$(':selected'),
      })
      cy.layout({ name: 'dagre' }).run()
    })

    document.getElementById('collapseAll')?.addEventListener('click', function () {
      ur.do('collapseAll') // cy.collapseAll(options);
      cy.layout({ name: 'dagre' }).run()
    })

    document.getElementById('expandAll')?.addEventListener('click', function () {
      ur.do('expandAll')
      cy.layout({ name: 'dagre' }).run()
    })

    document.addEventListener(
      'keydown',
      function (e) {
        // @ts-ignore
        if (e.ctrlKey && e.which == '90') {
          // @ts-ignore
          cy.undoRedo().undo()
          // @ts-ignore
        } else if (e.ctrlKey && e.which == '89') {
          // @ts-ignore
          cy.undoRedo().redo()
        }
        if (e.key == 'Delete') {
          cy.remove(cy.$(':selected'))
        }
      },
      true
    )

    cy.layout({ name: 'dagre' }).run()
  }, [ref.current])

  return (
    <>
      <div
        ref={ref}
        id="cy"
        style={{
          width: '1000px',
          height: '1000px',
        }}
      ></div>
    </>
  )
}

export default Cyt

const elements: any = [
  {
    data: { id: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c' },
    position: { x: 577.5410894097904, y: 612.5647477282114 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_3a5d1ad1-5bfe-48e7-99ee-0cdf3913b062',
      target: 'nwtN_743ee692-2363-4e76-a0c2-d6d3f717953e',
      id: 'nwtE_6d4afc19-88a0-4fd4-9fbf-3591cb6ba062',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_8753a0df-286b-4f9b-a00d-bc093113bac7',
      target: 'nwtN_9a23093c-257f-4e74-9f74-34cdf693daec',
      id: 'nwtE_605f28bd-77c0-4eef-8251-c5ba9668bda7',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      target: 'nwtN_7813a042-3f67-44ab-9d83-ced928bedd25',
      id: 'nwtE_5bafa3fe-246a-477c-849c-3284c3e62578',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_d578fedc-d576-4c07-8406-89956b346a9d',
      target: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      id: 'nwtE_6dda445b-530e-4b95-a3b1-e09cabc73993',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_ef9670aa-321a-41ba-a665-c3980f30eb2a',
      target: 'nwtN_9a23093c-257f-4e74-9f74-34cdf693daec',
      id: 'nwtE_b6195365-55fd-4e16-b03d-af46585b2618',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_7813a042-3f67-44ab-9d83-ced928bedd25',
      target: 'nwtN_477a1284-d1e7-44c6-8553-92fa8a6a553d',
      id: 'nwtE_6f57baf0-3722-4012-b33e-783c267645fa',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_9d2ac5f6-093a-4090-a750-942e7464a15f',
      target: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      id: 'nwtE_9fac6ca3-d907-4b5a-8496-b0edbc3815ca',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      target: 'nwtN_f95babe0-0c64-4076-b380-fad5605fec6e',
      id: 'nwtE_ac487e12-218a-45fd-b94a-f8fb51494baa',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: { id: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb' },
    position: { x: 195.56340747734816, y: 484.3338177685355 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_9d2ac5f6-093a-4090-a750-942e7464a15f',
      target: 'nwtN_e79b5f83-1e09-485f-83cb-f85c9c6dae25',
      id: 'nwtE_24228974-e8ba-4f05-8fe8-e775d314bcff',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_01047009-f54b-4c2a-8153-3d83c6e32eab',
      target: 'nwtN_6af44d07-59d1-4773-bab6-c99641e4810b',
      id: 'nwtE_56a86996-2c25-4071-b3a3-3000057eef90',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1',
      target: 'nwtN_30d6a1fb-f835-4d67-98db-dbfd8e91166e',
      id: 'nwtE_a690584d-974b-4a78-8169-584dc4aa2ef8',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_fc734e6e-c7c1-446f-8ae6-a3935cbb8b29',
      target: 'nwtN_1f8d5d5d-f085-4317-84d4-7b8612d11367',
      id: 'nwtE_bca25d80-d197-41ca-871c-9c3806a802c3',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 424.9142621725959, y: 163.663834699366 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_d578fedc-d576-4c07-8406-89956b346a9d',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 489.2620636399552, y: 205.99231330748833 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      target: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      id: 'nwtE_fdd46d3d-3529-4552-bcaf-e5a43364d5eb',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: { id: 'nwtN_9d2ac5f6-093a-4090-a750-942e7464a15f' },
    position: { x: 307.4167261049662, y: 242.51235456419 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_f95babe0-0c64-4076-b380-fad5605fec6e',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 433.25389502259094, y: 81.8501883151051 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_f95babe0-0c64-4076-b380-fad5605fec6e',
      target: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      id: 'nwtE_9298d0d5-8159-4b50-b880-48aa19738a86',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_6b82a0c0-db1a-4aed-8434-f56152c6bac1',
      target: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1',
      id: 'nwtE_449cf49b-88e5-44f9-9300-5a8dbd79c135',
    },
    group: 'edges',
  },
  {
    data: { id: 'nwtN_30d6a1fb-f835-4d67-98db-dbfd8e91166e' },
    position: { x: 579.7696102042084, y: 292.2890755756693 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1',
      target: 'nwtN_8753a0df-286b-4f9b-a00d-bc093113bac7',
      id: 'nwtE_15b708e3-501d-432c-941d-627df912946f',
    },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_ef9670aa-321a-41ba-a665-c3980f30eb2a',
      parent: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c',
    },
    position: { x: 540.8474401288637, y: 548.2864791672267 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_8de3d737-f713-404d-a181-c065f9cce74f',
      target: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c',
      id: 'nwtE_fd0f48e7-988f-4707-b126-b8a04dc3f64c',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_3a5d1ad1-5bfe-48e7-99ee-0cdf3913b062',
      target: 'nwtN_8de3d737-f713-404d-a181-c065f9cce74f',
      id: 'nwtE_7049cf2c-cc2b-40ed-94b8-590e2b703c45',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_1f8d5d5d-f085-4317-84d4-7b8612d11367',
      target: 'nwtN_ef9670aa-321a-41ba-a665-c3980f30eb2a',
      id: 'nwtE_28f94f80-370a-4819-b01e-7c14286528d6',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_1c510598-47d3-48a4-ba9d-fdfb915cda10',
      target: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
      id: 'nwtE_4b91ec16-80c7-476e-ac78-40ec11628f8c',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      target: 'nwtN_477a1284-d1e7-44c6-8553-92fa8a6a553d',
      id: 'nwtE_580dc718-3a38-4131-8527-5966dc7117bd',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: { id: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a' },
    position: { x: 491.63465589698114, y: 136.22441840106094 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_9a23093c-257f-4e74-9f74-34cdf693daec',
      parent: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c',
    },
    position: { x: 609.4769080081592, y: 540.0632700234723 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_91e530f8-4a18-423b-ae2b-0f87ae72d824',
      target: 'nwtN_787d128e-8256-4207-9e34-948bd142f842',
      id: 'nwtE_c1260ab9-e976-4b02-a0d4-28e4e7b71956',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_6af44d07-59d1-4773-bab6-c99641e4810b',
      target: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1',
      id: 'nwtE_1379f27c-2858-4c7c-b305-f9dbef07f992',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_f95babe0-0c64-4076-b380-fad5605fec6e',
      target: 'nwtN_477a1284-d1e7-44c6-8553-92fa8a6a553d',
      id: 'nwtE_70a9c66e-a05d-4795-9830-b941aa0bdf8d',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 491.4678555276823, y: 133.24054767963713 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1',
      target: 'nwtN_d578fedc-d576-4c07-8406-89956b346a9d',
      id: 'nwtE_3a1a451a-396c-46dd-844a-09c8c4506788',
    },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_1f8d5d5d-f085-4317-84d4-7b8612d11367',
      parent: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c',
    },
    position: { x: 597.8765594527064, y: 612.7761198138919 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_6b82a0c0-db1a-4aed-8434-f56152c6bac1',
      target: 'nwtN_6fb77c5b-4321-4c3c-a941-91a951082e71',
      id: 'nwtE_03b7f374-f923-4cbd-9b1c-358e6bd0a66a',
    },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_d578fedc-d576-4c07-8406-89956b346a9d',
      target: 'nwtN_1b72ec9f-c49f-4768-85a7-16ac6ff345e3',
      id: 'nwtE_bdaaa9a5-5464-44eb-a69a-177006535c60',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_7813a042-3f67-44ab-9d83-ced928bedd25',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 558.3550496213663, y: 140.29772029134818 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_477a1284-d1e7-44c6-8553-92fa8a6a553d',
      parent: 'nwtN_717d31aa-6b70-4067-bcf2-13e0f6bd879a',
    },
    position: { x: 508.5039225894028, y: 66.45652349463356 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_9a23093c-257f-4e74-9f74-34cdf693daec',
      target: 'nwtN_1f8d5d5d-f085-4317-84d4-7b8612d11367',
      id: 'nwtE_06738526-f767-4e34-8d41-bfd8b046d48e',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_fc734e6e-c7c1-446f-8ae6-a3935cbb8b29',
      parent: 'nwtN_50c55b8c-3489-4c4e-8bea-6a1c1162ac9c',
    },
    position: { x: 614.2347386907171, y: 685.0662254329505 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_1c510598-47d3-48a4-ba9d-fdfb915cda10',
      target: 'nwtN_8de3d737-f713-404d-a181-c065f9cce74f',
      id: 'nwtE_874c0108-f1b5-4331-9580-bbc904d5ed52',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_30d6a1fb-f835-4d67-98db-dbfd8e91166e',
      target: 'nwtN_7813a042-3f67-44ab-9d83-ced928bedd25',
      id: 'nwtE_8ecc2707-8d9f-4c5a-b79f-36028161a2de',
    },

    group: 'edges',
  },
  {
    data: { id: 'nwtN_3a5d1ad1-5bfe-48e7-99ee-0cdf3913b062' },
    position: { x: 390.8088604802138, y: 631.143932383176 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_1c510598-47d3-48a4-ba9d-fdfb915cda10' },
    position: { x: 385.86501672672586, y: 549.4623389479385 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_01047009-f54b-4c2a-8153-3d83c6e32eab' },
    position: { x: 420.38955421084455, y: 471.15574980196067 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_e79b5f83-1e09-485f-83cb-f85c9c6dae25' },
    position: { x: 369.7167651842458, y: 293.0403182947785 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_2ac61ffd-0f55-4d76-ac39-f12efc1712ba' },
    position: { x: 418.05570853622856, y: 392.34060880148394 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_6af44d07-59d1-4773-bab6-c99641e4810b' },
    position: { x: 488.8353737093525, y: 424.0878886254484 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_6b82a0c0-db1a-4aed-8434-f56152c6bac1' },
    position: { x: 438.2063143421404, y: 315.0732399204851 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_8de3d737-f713-404d-a181-c065f9cce74f' },
    position: { x: 449.9163565836266, y: 594.1831978504854 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_65df5546-116f-4bda-92c7-acc6549589f1' },
    position: { x: 511.65889587382577, y: 346.18005665157585 },
    group: 'nodes',
  },
  {
    data: { id: 'nwtN_8753a0df-286b-4f9b-a00d-bc093113bac7' },
    position: { x: 562.2598442850485, y: 415.8153103233126 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_9d2ac5f6-093a-4090-a750-942e7464a15f',
      target: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
      id: 'nwtE_11040a46-0530-4375-a13d-2cdca0a98536',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_ef9670aa-321a-41ba-a665-c3980f30eb2a',
      target: 'nwtN_6af44d07-59d1-4773-bab6-c99641e4810b',
      id: 'nwtE_b47d4380-4724-4409-a449-1d80a798f9df',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_e79b5f83-1e09-485f-83cb-f85c9c6dae25',
      target: 'nwtN_6b82a0c0-db1a-4aed-8434-f56152c6bac1',
      id: 'nwtE_b7156db8-08d3-4a8d-9b43-db3de0701017',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_6b82a0c0-db1a-4aed-8434-f56152c6bac1',
      target: 'nwtN_2ac61ffd-0f55-4d76-ac39-f12efc1712ba',
      id: 'nwtE_1ab89f57-598a-4805-85d6-445f44bed701',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_2ac61ffd-0f55-4d76-ac39-f12efc1712ba',
      target: 'nwtN_01047009-f54b-4c2a-8153-3d83c6e32eab',
      id: 'nwtE_3a06bd73-a5ea-42fc-bebd-6cc9b227c4d4',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_01047009-f54b-4c2a-8153-3d83c6e32eab',
      target: 'nwtN_1c510598-47d3-48a4-ba9d-fdfb915cda10',
      id: 'nwtE_fe9dae92-bb4d-4fbc-8b00-3275e457899b',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_1c510598-47d3-48a4-ba9d-fdfb915cda10',
      target: 'nwtN_3a5d1ad1-5bfe-48e7-99ee-0cdf3913b062',
      id: 'nwtE_498e1c01-8c7d-4711-86d4-25119fd459b3',
    },

    group: 'edges',
  },
  {
    data: {
      id: 'nwtN_91be4b3b-b492-4cf2-822e-c2a1de14dbfe',
      parent: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
    },
    position: { x: 131.35922693271124, y: 605.7954433087209 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_743ee692-2363-4e76-a0c2-d6d3f717953e',
      parent: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
    },
    position: { x: 263.1586191787393, y: 578.1716399433802 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_4d5b8b52-1f20-45f8-bc0f-3a4a1235c0f5',
      parent: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
    },
    position: { x: 195.2099595474637, y: 563.255374790295 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_b282d9cf-0120-42bc-9036-3bd48f925d1e',
      parent: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
    },
    position: { x: 256.9500139684577, y: 508.8943151396569 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_0bd04732-5c51-4577-87f3-3675b3294ac3',
      parent: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
    },
    position: { x: 127.96819577595704, y: 535.5200800812347 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_d70e8589-ab02-41e3-879f-29aed04212fa',
      parent: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
    },
    position: { x: 195.56340747734816, y: 557.3448792241888 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_0f5340ab-a217-423f-b5f7-0a149f3217e8',
      parent: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
    },
    position: { x: 253.48384362872935, y: 375.70472845792517 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_91e530f8-4a18-423b-ae2b-0f87ae72d824',
      parent: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
    },
    position: { x: 187.4692319760543, y: 341.24719222835006 },
    group: 'nodes',
  },
  {
    data: {
      id: 'nwtN_787d128e-8256-4207-9e34-948bd142f842',
      parent: 'nwtN_04d7dde6-171a-4179-85f5-a0cf510f55fb',
    },
    position: { x: 119.07770758703417, y: 363.03066656565034 },
    group: 'nodes',
  },
  {
    data: {
      source: 'nwtN_4d5b8b52-1f20-45f8-bc0f-3a4a1235c0f5',
      target: 'nwtN_91be4b3b-b492-4cf2-822e-c2a1de14dbfe',
      id: 'nwtE_720b0a71-9ad3-4821-b828-ecace971acd1',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_91be4b3b-b492-4cf2-822e-c2a1de14dbfe',
      target: 'nwtN_0bd04732-5c51-4577-87f3-3675b3294ac3',
      id: 'nwtE_ce9e18ee-2bb9-4abb-88f8-272b3d76a8b4',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_743ee692-2363-4e76-a0c2-d6d3f717953e',
      target: 'nwtN_4d5b8b52-1f20-45f8-bc0f-3a4a1235c0f5',
      id: 'nwtE_6a465aa8-1c8b-4455-95bc-e67b77f3f7d3',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_b282d9cf-0120-42bc-9036-3bd48f925d1e',
      target: 'nwtN_743ee692-2363-4e76-a0c2-d6d3f717953e',
      id: 'nwtE_c6b430bd-17fc-4b1f-82a9-16bc0d5dfa78',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_0bd04732-5c51-4577-87f3-3675b3294ac3',
      target: 'nwtN_4d5b8b52-1f20-45f8-bc0f-3a4a1235c0f5',
      id: 'nwtE_12dd751b-6a30-4bef-8511-d36869559740',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_4d5b8b52-1f20-45f8-bc0f-3a4a1235c0f5',
      target: 'nwtN_b282d9cf-0120-42bc-9036-3bd48f925d1e',
      id: 'nwtE_7944e4ea-bb97-484f-a6ee-0d77d7bab80f',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_b282d9cf-0120-42bc-9036-3bd48f925d1e',
      target: 'nwtN_0f5340ab-a217-423f-b5f7-0a149f3217e8',
      id: 'nwtE_d0a8fa82-36ac-4c28-837b-aa38b8f2cdb6',
    },
    position: { x: 0, y: 0 },
    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_0f5340ab-a217-423f-b5f7-0a149f3217e8',
      target: 'nwtN_91e530f8-4a18-423b-ae2b-0f87ae72d824',
      id: 'nwtE_a4051f32-f6fe-451e-b153-e4de31f4808b',
    },

    group: 'edges',
  },
  {
    data: {
      source: 'nwtN_0f5340ab-a217-423f-b5f7-0a149f3217e8',
      target: 'nwtN_e79b5f83-1e09-485f-83cb-f85c9c6dae25',
      id: 'nwtE_70a31acd-428d-47be-a981-38107a83d2e1',
    },

    group: 'edges',
  },
]
