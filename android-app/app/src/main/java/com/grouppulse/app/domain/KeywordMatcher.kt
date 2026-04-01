package com.grouppulse.app.domain

import com.grouppulse.app.data.local.KeywordRuleEntity
import com.grouppulse.app.model.MatchType
import java.util.Locale
import javax.inject.Inject

class KeywordMatcher @Inject constructor() {
    fun detectMatches(message: String, rules: List<KeywordRuleEntity>): List<KeywordRuleEntity> {
        val normalizedMessage = normalize(message, caseSensitive = false)
        return rules.filter { rule ->
            if (!rule.enabled) return@filter false
            val msg = normalize(message, rule.caseSensitive)
            val keyword = normalize(rule.keyword, rule.caseSensitive)
            when (rule.matchType) {
                MatchType.EXACT -> msg.split("\\s+".toRegex()).contains(keyword)
                MatchType.CONTAINS -> msg.contains(keyword)
            }
        }.ifEmpty {
            rules.filter { it.enabled && normalizedMessage.contains(normalize(it.keyword, false)) }
        }
    }

    private fun normalize(value: String, caseSensitive: Boolean): String {
        val trimmed = value.trim().replace("\\s+".toRegex(), " ")
        return if (caseSensitive) trimmed else trimmed.lowercase(Locale.ROOT)
    }
}
