import React from 'react';
import { Sparkles, ChevronDown, Mic, MoreHorizontal, Plus, AudioLines } from 'lucide-react';
import './AskAnything.scss';
import aiChatimg from '../../../assets/ai-chat.svg';
// Ask Anything Component
const AskAnything = () => (
    <div className="ask-anything-card">
       <div className='cat_box'>
         <div className="card-header">
                       <input type="text" placeholder="Ask anything" />
        </div>
        <div className="ai-input-wrapper">
          <div className='input_option'>
              <img src={aiChatimg} className="ai-icon"/>
            <button className="ai-model-selector">HRMS <ChevronDown size={16} /></button>
          </div>
            <div className="input-actions">
                <button><Mic size={20} /></button>
                <button><AudioLines size={20} /></button>
                <button className="add-btn"><Plus size={20} /></button>
            </div>
        </div>
       </div>
        <div className="suggestion-chips">
            <button>Create Onboarding</button>
            <button>Create Employee Report</button>
            <button>Check Employee List</button>
            <button>Review Performance</button>
        </div>
    </div>
);

export default AskAnything;
