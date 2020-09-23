import React, { useState } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import classnames from 'classnames';

import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

import css from '../styles/tutorials/ref-template.module.css';
import grid from '../styles/grid.module.css';

const ClassRefTemplate = ({ data, pageContext }) => {
  let ref, link;
  const [show, setShow] = useState(false);

  if (data.json !== null) {
    ref = data.json.childJson;
  }

  if (pageContext.libraryName === 'processing') {
    link = '/reference/' + pageContext.name + '.html';
  } else {
    link =
      '/reference/libraries/' +
      pageContext.libraryName +
      '/' +
      pageContext.name +
      '.html';
  }

  const toggleSidebar = (show) => {
    setShow(show);
  };

  return (
    <Layout>
      <Sidebar refs={data.refs} onChange={toggleSidebar} show={show} />
      {data.json !== null ? (
        <div
          className={classnames(grid.grid, css.root)}
          style={{ marginLeft: show ? '150px' : '50px' }}>
          <h4 className={grid.col1}>Class name</h4>
          <h3 className={grid.col6}>{ref.name}</h3>
          <h4 className={grid.col1}>Description</h4>
          <p className={grid.col6}>{ref.description}</p>
          {!data.allFile.edges.length ? (
            ''
          ) : (
            <>
              <h4 className={grid.col1}>Examples</h4>
              <ul className={classnames(grid.col6, css.list)}>
                {data.allFile.edges.map((edge, key) => {
                  return (
                    <li key={'ex' + key} className={grid.col4}>
                      {edge.node.extension === 'pde' && (
                        <p>
                          {edge.node.name}
                          {edge.node.internal.content}
                        </p>
                      )}
                      {edge.node.extension === 'png' && (
                        <Img fixed={edge.node.childImageSharp.fixed} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <h4 className={grid.col1}>Constructors</h4>
          <ul className={classnames(grid.col6, css.list)}>
            {ref.constructors.map((cons, key) => {
              return <li key={'f' + key}>{cons}</li>;
            })}
          </ul>
          {!ref.classFields.length ? (
            ''
          ) : (
            <>
              <h4 className={grid.col1}>Fields</h4>
              <ul className={classnames(grid.col6, css.list)}>
                {ref.classFields.map((field, key) => {
                  return (
                    <li key={'f' + key}>
                      <a href={field.anchor + '.html'}>{field.name} </a>
                      {field.desc}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <h4 className={grid.col1}>Methods</h4>
          <ul className={classnames(grid.col6, css.list)}>
            {ref.methods.map((method, key) => {
              return (
                <li key={'m' + key} className={grid.col6}>
                  <a href={method.anchor + '.html'} className={grid.col1}>
                    {method.name}{' '}
                  </a>
                  <span className={grid.col4}>{method.desc}</span>
                </li>
              );
            })}
          </ul>
          {!ref.related.length ? (
            ''
          ) : (
            <>
              <h4 className={grid.col1}>Related</h4>
              <ul className={classnames(grid.col6, css.list)}>
                {ref.related.map((rel, key) => (
                  <li key={key + 'rel'} className={grid.col6}>
                    <a href={rel + '.html'} className={grid.col1}>
                      {rel.replace(/_/g, '()')}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div>
          This page is not translated, please refer to the
          <Link to={link}> english page</Link>
        </div>
      )}
    </Layout>
  );
};

export default ClassRefTemplate;

export const query = graphql`
  query($name: String!, $assetsName: String!, $locale: String!) {
    json: file(fields: { name: { eq: $name }, lang: { eq: $locale } }) {
      childJson {
        name
        description
        constructors
        classFields {
          anchor
          name
          desc
        }
        methods {
          anchor
          name
          desc
        }
        related
      }
    }
    allFile(filter: { relativeDirectory: { eq: $assetsName } }) {
      edges {
        node {
          name
          internal {
            content
          }
          extension
          childImageSharp {
            fixed {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    refs: allFile(
      filter: {
        fields: { lang: { eq: "en" }, lib: { eq: "processing" } }
        childJson: { type: { nin: ["method", "field"] } }
      }
    ) {
      nodes {
        name
        relativeDirectory
        childJson {
          category
          subcategory
          name
        }
      }
    }
  }
`;
