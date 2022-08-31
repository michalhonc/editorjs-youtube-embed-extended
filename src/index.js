/**
 * YouTube embed plugin for Editor.js.
 *
 * @author Tei Yuan Wei
 * @license MIT License (MIT)
 * @version 1.0.3
 *
 */

import "./main.css";
import ToolboxIcon from "./svg/toolbox.svg";

export default class YoutubeEmbed {
  /**
   *
   * Get toolbox settings
   *
   * @return {{icon: string, title: string}}
   *
   */
  static get toolbox() {
    return {
      title: "YouTube",
      icon: ToolboxIcon,
    };
  }

  /**
   *
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {data: DelimiterData} — previously saved data
   *
   */
  constructor({ data, config, api, readOnly }) {
    this.data = data;
    this.readOnly = readOnly;

    this.wrapper = null;
    this.url = null;
    this.isEdited = false;
  }

  /**
   *
   * Return tool's view
   *
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    this.wrapper = document.createElement("div");
    const input = document.createElement("input");
    input.value = this.data && this.data.url ? this.data.url : "";
    this.url = input.value;
    input.placeholder = "Paste YouTube url here...";

    this.wrapper.classList.add("block-wrapper");
    this.wrapper.appendChild(input);
    this._createIframe(input.value);

    input.addEventListener("change", (event) => {
      this.isEdited = true;

      this.url = input.value;
      this._createIframe(input.value);
    });
    return this.wrapper;
  }

  /**
   *
   * Get video ID
   * @private
   * @param {string} url
   *
   */
  _getVideoId(url) {
    return url.match(/(?<=v=)[a-zA-Z0-9_]+(?=\&?)/);
  }

  /**
   *
   * Insert thumbnail for Youtube
   * @private
   * @param {string} url
   *
   */
  _getThumbnail(url) {
    const videoId = this._getVideoId(url);
    const thumbnailSizes = ['sddefault', 'mqdefault', 'hqdefault', 'maxresdefault']

    function getUrl(size) {
      const thumbnailUrl = 'https://img.youtube.com/vi'
      return `${thumbnailUrl}/${videoId}/${size}.png`
    }

    return {
      original: getUrl('0'),
      sequence: [getUrl('1'), getUrl('2'), getUrl('3')],
      sd: getUrl('sddefault'),
      mq: getUrl('mqdefault'),
      hq: getUrl('hqdefault'),
      maxres: getUrl('maxresdefault'),
    }
  }

  /**
   *
   * Create iframe for YouTube embed
   * @private
   * @param {string} url
   *
   */
  _createIframe(url) {
    const videoId = this._getVideoId(url);

    if (videoId == null) {
      if (this.isEdited) {
        this.wrapper.querySelector("input").classList.add("invalid");
      }
      return;
    }

    this.wrapper.innerHTML = null;
    const plyrContainer = document.createElement("div");
    plyrContainer.classList.add("video-wrapper");

    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
    iframe.setAttribute("allowfullscreen", true);

    plyrContainer.appendChild(iframe);
    this.wrapper.appendChild(plyrContainer);
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Return block data
   *
   * @public
   * @param {HTMLDivElement} blockContent - Block wrapper
   * @returns {object}
   */
  save(blockContent) {
    const input = blockContent.querySelector("input");
    return {
      url: this.url,
      thumbnail: this._getThumbnail(this.url),
    };
  }
}
