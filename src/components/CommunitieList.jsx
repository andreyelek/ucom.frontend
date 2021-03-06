import React from 'react';
import UserCard from './UserCard';
import IconRemove from './Icons/Remove';
import { getFileUrl } from '../utils/upload';

const CommunitieList = props => (
  <div className="communitie-list">
    {props.list.map((item, index) => (
      <div className="communitie-list__item" key={index}>
        <div className="toolbar">
          <div className="toolbar__main">
            <UserCard
              sign=""
              userName={item.title}
              accountName={item.nickname || item.description}
              avatarUrl={typeof item.avatarFilename === 'string' ? getFileUrl(item.avatarFilename) : item.avatarFilename}
            />
          </div>
          <div className="toolbar__side">
            <div
              role="presentation"
              className="communitie-list__remove"
              onClick={() => {
                if (typeof props.onClickRemove === 'function') {
                  props.onClickRemove(index);
                }
              }}
            >
              <IconRemove />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CommunitieList;
