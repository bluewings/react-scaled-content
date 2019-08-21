import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useImmerReducer } from 'use-immer';
import cx from 'classnames';
import { css } from 'emotion';
import styles from './Scaled.module.scss';

export interface IScaledProps {
  children?: any;
  fit?: 'contain' | 'cover' | 'cover-width' | 'cover-height';
  overflow?: 'hidden' | 'visible';
  align?: string;
  watch?: boolean;
}

function Scaled({ children, fit = 'contain', overflow, align }: IScaledProps) {
  const outer = useRef<any>();
  const inner = useRef<any>();

  const [
    { scale, availWidth, availHeight, contentWidth, contentHeight },
    dispatch,
  ]: [any, any] = useImmerReducer(reducer, initialState);

  const scaleText = useRef<any>();
  useEffect(() => {
    const handleResize = () => {
      if (inner.current && outer.current && outer.current.parentElement) {
        const {
          scale,
          availWidth,
          availHeight,
          contentWidth,
          contentHeight,
        } = getScale(inner.current, outer.current.parentElement, fit);

        const _scaleText = JSON.stringify({
          scale,
          availWidth,
          availHeight,
          contentWidth,
          contentHeight,
        });

        if (scaleText.current !== _scaleText) {
          scaleText.current = _scaleText;
          dispatch({
            type: SET_SCALE,
            payload: {
              scale,
              availWidth,
              availHeight,
              contentWidth,
              contentHeight,
            },
          });
        }
      }
    };

    const cancelAnimationFrame = animationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame();
      window.removeEventListener('resize', handleResize);
    };
  }, [fit, dispatch]);

  const aligns = useMemo(() => {
    const _align = `${align}`.toLowerCase();
    return ['top', 'left', 'right', 'bottom'].filter(
      (e) => _align.search(e) !== -1,
    );
  }, [align]);

  const outerClass = useMemo(() => {
    if (scale !== null) {
      let paddingTop;
      if (aligns.indexOf('top') !== -1) {
        paddingTop = 0;
      } else if (aligns.indexOf('bottom') !== -1) {
        paddingTop = availHeight - contentHeight * scale;
      } else {
        paddingTop = (availHeight - contentHeight * scale) / 2;
      }
      let paddingLeft;
      if (aligns.indexOf('left') !== -1) {
        paddingLeft = 0;
      } else if (aligns.indexOf('right') !== -1) {
        paddingLeft = availWidth - contentWidth * scale;
      } else {
        paddingLeft = (availWidth - contentWidth * scale) / 2;
      }
      let size = '';
      if (fit === 'cover-width') {
        size = `height: ${contentHeight * scale}px;`;
      } else if (fit === 'cover-height') {
        size = `width: ${contentWidth * scale}px;`;
      }
      return css`
        overflow: ${overflow === 'visible' ? 'visible' : 'hidden'};
        ${size}
        > div {
          margin-top: ${paddingTop}px;
          margin-left: ${paddingLeft}px;
          transform: translate(${(1 - scale) * -50}%, ${(1 - scale) * -50}%)
            scale(${scale});
          opacity: 1;
        }
      `;
    }
    return;
  }, [
    scale,
    availWidth,
    availHeight,
    contentWidth,
    contentHeight,
    aligns,
    overflow,
    fit,
  ]);

  return (
    <div ref={outer} className={cx(styles.outer, outerClass)}>
      <div ref={inner} className={styles.inner}>
        {typeof children === 'function'
          ? children({
              scale,
              availWidth,
              availHeight,
              contentWidth,
              contentHeight,
            })
          : children}
      </div>
    </div>
  );
}

const SET_SCALE = 'set-scale';

const initialState = {
  scale: null,
  availWidth: null,
  availHeight: null,
  contentWidth: null,
  contentHeight: null,
};

function reducer(draft: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case SET_SCALE:
      const {
        scale,
        availWidth,
        availHeight,
        contentWidth,
        contentHeight,
      } = payload;
      draft.scale = scale;
      draft.availWidth = availWidth;
      draft.availHeight = availHeight;
      draft.contentWidth = contentWidth;
      draft.contentHeight = contentHeight;
      return;
  }
}

const getScale = (inner: HTMLElement, outer: HTMLElement, fit: string) => {
  const {
    width: parentWidth,
    height: parentHeight,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth,
    borderBottomWidth,
    boxSizing,
  }: any = window.getComputedStyle(outer);

  const availWidth =
    parseInt(parentWidth, 10) -
    (boxSizing === 'content-box'
      ? 0
      : parseInt(paddingLeft, 10) +
        parseInt(paddingRight, 10) +
        parseInt(borderLeftWidth, 10) +
        parseInt(borderRightWidth, 10));

  const availHeight =
    parseInt(parentHeight, 10) -
    (boxSizing === 'content-box'
      ? 0
      : parseInt(paddingTop, 10) +
        parseInt(paddingBottom, 10) +
        parseInt(borderTopWidth, 10) +
        parseInt(borderBottomWidth, 10));

  const {
    width: innerWidth,
    height: innerHeight,
    paddingTop: innerPaddingTop,
    paddingLeft: innerPaddingLeft,
  }: any = window.getComputedStyle(inner);

  const contentWidth =
    parseInt(innerWidth, 10) - parseInt(innerPaddingLeft, 10);

  const contentHeight =
    parseInt(innerHeight, 10) - parseInt(innerPaddingTop, 10);

  let scale;
  if (fit === 'cover') {
    scale = Math.max(availWidth / contentWidth, availHeight / contentHeight);
  } else if (fit === 'cover-width') {
    scale = availWidth / contentWidth;
  } else if (fit === 'cover-height') {
    scale = availHeight / contentHeight;
  } else {
    scale = Math.min(availWidth / contentWidth, availHeight / contentHeight);
  }
  return {
    scale,
    availWidth,
    availHeight,
    contentWidth,
    contentHeight,
  };
};

function animationFrame(callback: Function, endInSec = 500) {
  let id: number;
  const now = new Date().valueOf();
  function tick() {
    if (callback) {
      callback();
    }
    if (new Date().valueOf() - now < endInSec) {
      id = requestAnimationFrame(tick);
    }
  }
  tick();
  return () => {
    cancelAnimationFrame(id);
  };
}

export default Scaled;
