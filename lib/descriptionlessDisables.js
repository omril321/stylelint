'use strict';

/** @typedef {import('stylelint').RangeType} RangeType */
/** @typedef {import('stylelint').DisableReportRange} DisableReportRange */
/** @typedef {import('stylelint').StylelintDisableOptionsReport} StylelintDisableOptionsReport */

/**
 * @param {import('stylelint').StylelintResult[]} results
 */
module.exports = function (results) {
	results.forEach((result) => {
		// File with `CssSyntaxError` have not `_postcssResult`
		if (!result._postcssResult) {
			return;
		}

		const rangeData = result._postcssResult.stylelint.disabledRanges;

		Object.keys(rangeData).forEach((rule) => {
			rangeData[rule].forEach((range) => {
				if (range.description) return;

				// Avoid duplicates from stylelint-disable comments with multiple rules.
				const alreadyReported = entry.ranges.find((existing) => {
					return existing.start === range.start && existing.end === range.end;
				});

				if (alreadyReported) return;

				result.warnings.push({
					text: `Disable for "${rule}" is missing a description`,
					rule: '--report-descriptionless-disables',
					line: range.comment.source.start.line,
					column: range.comment.source.start.column,
					severity: 'error',
				});
			});
		});
	});
};
