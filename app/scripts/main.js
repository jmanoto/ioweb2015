/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(exports) {
  'use strict';

  exports.IOWA = exports.IOWA || {};

  // TODO(ericbidelman): add i18n support.
  // if (exports.ENV == 'dev') {
  //   // Polyfill needs I18nMsg to exist before setting the lang. Timing is fine for native.
  //   // Set locale for entire site (e.g. i18n-msg elements).
  //   document.addEventListener('HTMLImportsLoaded', function() {
  //     I18nMsg.lang = document.documentElement.lang || 'en';
  //   });
  // }

  // Pages that care to know when the page transitions are final should listen
  // for the page-transition-done event. It's the responsibility of the subpage
  // to  not add multiple listeners for this event on subsequent navigations.
  // exports.addEventListener('page-transition-done', function(e) {
  //   // TODO
  // })

  console.time('worker startup');
  exports.worker = new Worker('scripts/worker.js');
  console.timeEnd('worker startup');

  exports.worker.addEventListener('message', function(e) {
    console.timeEnd('worker fetch data');

    if (!e.data) {
      return;
    }

    var template = IOWA.Elements.Template;

    var data = e.data;
    if ('scheduleData' in data) {
      template.scheduleData = data.scheduleData;
      template.filterSessionTypes = data.tags.filterSessionTypes;
      template.filterThemes = data.tags.filterThemes;
      template.filterTopics = data.tags.filterTopics;
    }
  });

  console.time('worker fetch data');
  exports.worker.postMessage({cmd: 'CMD_FETCH_SCHEDULE'}); // Start the worker.worker

})(window);
